#[macro_use]
extern crate rocket;
use rocket::data::{Limits, ToByteUnit};
use rocket::fs::TempFile;

use std::fs::File;
use std::io::Write;
use uuid::Uuid;

use std::process::Command;

use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    port: u16,
}

fn sumatra_path() -> String {
    format!("{}{}", std::env::temp_dir().display(), "sumatra.exe")
}

fn create_sumatra() {
    let sumatra = include_bytes!("../Sumatra.exe");

    let mut f = File::create(sumatra_path()).unwrap();

    f.write(sumatra);
    
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let args = Args::parse();
    create_sumatra();

    let figment = rocket::Config::figment()
        .merge(("port", args.port))
        .merge(("address","0.0.0.0"))
        .merge(("limits", Limits::new().limit("file", 40.mebibytes())));

    let _rocket = rocket::custom(figment)
        .mount("/", routes![printer])
        .launch()
        .await?;

    Ok(())
}

#[post("/printer/<name>/<amount>", format = "multipart/form-data", data = "<file>")]
async fn printer(mut file: TempFile<'_>, name: &str,amount:u32) -> std::io::Result<()> {
    let pdf_path = format!("{}/{}.pdf", std::env::temp_dir().display(), Uuid::new_v4());
    println!("{}", &pdf_path);
    file.persist_to(&pdf_path).await;

    //-print-settings "3x"

    let child = Command::new("powershell")
        .arg(format!(
            "{} -print-to \"{}\" -print-settings \"{}x\" \"{}\"",
            sumatra_path(),
            name,
            amount,
            pdf_path
        ))
        .spawn()
        .unwrap().wait();

    //std::fs::remove_file(pdf_path);

    Ok(())
}
