## Initial project setup 
npm init -y 
npm install tyescript 
npx tsc --init
update tsconfig "rootDir": "./src",     "outDir: "./dist",
now create folder src and inside which we write our typeScript code 
add a script to package.json "dev": "tsc -b && node ./dist/index.js" to compile the code "tsc -b"  to run code "node ./dist/index.js"
npm install ws @types/ws