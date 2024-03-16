const fs = require("fs").promises;
const path = require("path");

async function calculateSalesTotal(salesFiles) {

  // Final sales total
  let salesTotal = 0;

  // (1) Tterates over the `salesFiles` array.
  for (file of salesFiles) {

    // (2) Reads the file.
    const fileContents = await fs.readFile(file)

    // (3) Parses the content as JSON.
    const data = JSON.parse(fileContents);

    // (4) Increments the `salesTotal` variable with the `total` value from the file.
    salesTotal += data.total;
  }
  return salesTotal;
}

async function findSalesFiles(folderName) {

  // (1) Add an array at the top, to hold the paths to all the sales files that the program finds.
  let results = [];

  // (2) Read the currentFolder with the `readdir` method. 
  const items = await fs.readdir(folderName, { withFileTypes: true });

  // (3) Add a block to loop over each item returned from the `readdir` method using the asynchronous `for...of` loop. 
  for (const item of items) {

    // (4) Add an `if` statement to determine if the item is a file or a directory. 
    if (item.isDirectory()) {

      // (5) If the item is a directory,  recursively call the function `findSalesFiles` again, passing in the path to the item. 
      const resultsReturned = await findSalesFiles(path.join(folderName, item.name));
      results = results.concat(resultsReturned);
    } else {
      // (6) If it's not a directory, add a check to make sure the item name matches *sales.json*.
      if (path.extname(item.name) === ".json")
        results.push(`${folderName}/${item.name}`);
    }
  }


  return results;
}

async function main() {
  const salesDir = path.join(__dirname, "stores");

  // (1) Create a variable called `salesTotalsDir`, which holds the path of the *salesTotals* directory.
  const salesTotalsDir = path.join(__dirname, "salesTotals");

  try {
    // (2) Create the directory if it doesn't already exist.
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  // Calculate sales totals
  const salesFiles = await findSalesFiles(salesDir);

   // (1) Add a call to the `calculateSalesTotals` function just above the `fs.writeFile` call.
   const salesTotal = await calculateSalesTotal(salesFiles);

   // (2) Modify the `fs.writeFile` block to write the value of the `salesTotal` variable to the *totals.txt* file.
   await fs.writeFile(
     path.join(salesTotalsDir, "totals.txt"),
     `${salesTotal}\r\n`,
     { flag: "a" }
   );
}

main();