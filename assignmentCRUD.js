
const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");

// membuat folder data apabila tidak ada
const dirPath='./data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada
const dataPath='./data/contacts.json';
if (!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]','utf-8');
}
yargs.command({
    command:'add',
    describe:'add new contact',
    builder:{
        name: {
            describe:'Contact Name',
            demandOption: true,
            
            type:'string',
        },
        email: {
            describe:'Contact Email',
            demandOption: false,
            
            type:'string',
        },
        mobile: {
            describe:'Contact Mobile Phone Number',
            demandOption: true,
            type:'string',
        },
    },
    handler(argv){
        const contact = {
            name:argv.name,
            email:argv.email,
            mobile:argv.mobile,
        };
        const file = fs.readFileSync(dataPath,'utf8');
        const contacts = JSON.parse(file);
        
        let success=true;
        if (contacts.find(existingContact => existingContact.name === contact.name)) {
            console.log("Error: Contact with this name already exists.");
            success=false;
        }
        if (contact.email && !validator.isEmail(contact.email)) {
            console.log("Error: Invalid email")
            success=false;
        }
        if (validator.isMobilePhone(contact.mobile, 'id-ID')==false) {
            console.log("Error: Invalid number")
            success=false;
        } 
        if (success) {
            contacts.push(contact);
            console.log(contact);
            fs.writeFileSync(dataPath, JSON.stringify(contacts));
        }

    }, 
});

// Command detail akan menampilkan informasi lengkap dari sebuah kontak berdasarkan namanya.
yargs.command({
    command:'detail',
    describe:'Display details of a contact',
    builder: {
        name: {
            describe: 'Contact Name',
            demandOption: true,
            type:'string',
        },
    },
    handler(argv) {
        const file = fs.readFileSync(dataPath, 'utf8');
        const contacts = JSON.parse(file);
        const contact = contacts.find(existingContact => existingContact.name === argv.name);
        
        // jika tidak menemukan contact dengan nama yang diinputkan maka akan Error.
        if (!contact) {
            console.log('Error: Contact not Found.');
            return;
        }
        
        // jika ditemukan contact dengan nama yang diinputkan maka akan di tampilkan di Contact Details.
        console.log('--- Contact Details ---');
        console.log(`Name: ${contact.name}`);
        console.log(`Email: ${contact.email || 'N/A'}`);
        console.log(`Mobile: ${contact.mobile}`);
        console.log('-----------------------');
    }
});

// Command list digunakan untuk menampilkan daftar semua kontak yang tersimpan dalam file contacts.json.
yargs.command({
    command: 'list',
    describe: 'list all contacts',
    handler() {
        const file = fs.readFileSync(dataPath, 'utf8');
        const contacts = JSON.parse(file);
        console.log('--- Contacts ---');
        // contacts.forEach digunakan untuk melakukan iterasi (loop) melalui array contacts. 
        // Ini berarti untuk setiap contact dalam contacts, program akan menjalankan kode di dalam blok '{}'.
        contacts.forEach(contact => {
            console.log(`Name: ${contact.name}`);
            console.log(`Email: ${contact.email || 'N/A'}`);
            console.log(`Mobile: ${contact.mobile}`);
            console.log('----------------');
        });
    }
});

// Command update memungkinkan pengguna untuk mengubah informasi email atau nomor telepon dari sebuah kontak berdasarkan namanya.
yargs.command({
    command:'update',
    describe:'Update a contact',
    builder: {
        name: {
            describe:'contact name',
            demandOption: true,
            type: 'string',
        },
        email: {
            describe: 'New Email (optional)',
            demandOption: false,
            type: 'string',
        },
        mobile: {
            describe: 'New Mobile Phone Number (optional)',
            demandOption: false,
            type: 'string',
        },
    },
    handler(argv) {
        const file = fs.readFileSync(dataPath, 'utf8');
        let contacts = JSON.parse(file);
        
        // const contactIndex digunakan untuk mencari index dari kontak yang ingin diupdate berdasarkan nama yang diberikan
        // Jika contactIndex sama dengan -1, ini berarti kontak dengan nama yang diberikan tidak ditemukan.
        const contactIndex = contacts.findIndex(existingContact => existingContact.name === argv.name);

        if (contactIndex === -1) {
            console.log('Error: Contact not found');
            return;
        }
        if (argv.email) {
            if (!validator.isEmail(argv.email)) {
                console.log('Error: Invalid Email');
                return;
            }
            contacts[contactIndex].email = argv.email;
        }
        if (argv.mobile) {
            if (!validator.isMobilePhone(argv.mobile, 'id-ID')) {
                console.log('Error: Invalid Mobile Number');
                return;
            }
            contacts[contactIndex].mobile = argv.mobile;
        }
        // write kembali ke file JSON dengan kontak yang telah diupdate
        fs.writeFileSync(dataPath, JSON.stringify(contacts));
        console.log('Contact Update Successfully.');
    }
});

// Command delete digunakan untuk menghapus sebuah kontak berdasarkan nama dari file contacts.json. 
// Ini memungkinkan pengguna untuk menghapus kontak yang tidak diperlukan lagi dari daftar kontak.
yargs.command({
    command:'delete',
    describe:'Delete a Contact',
    builder: {
        name: {
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        const file = fs.readFileSync(dataPath, 'utf8');
        let Contacts = JSON.parse(file);
        // contacts.filter digunakan untuk membuat array baru updatedContacts yang berisi semua kontak 
        //kecuali kontak dengan nama yang diinput oleh pengguna.
        const updateContacts = Contacts.filter(contact => contact.name !== argv.name);
        
        // Jika panjang array contacts dan updatedContacts sama, itu berarti tidak ada kontak yang dihapus karena tidak ada yang sesuai dengan nama yang diinput. 
        // Dalam hal ini, program akan mencetak pesan error.
        if (Contacts.length === updateContacts.length) {
            console.log('Error: Contact not found.');
            return;
        }

        fs.writeFileSync(dataPath, JSON.stringify(updateContacts));
        console.log('Contact deleted successfully.');
    }
});

yargs.parse();



