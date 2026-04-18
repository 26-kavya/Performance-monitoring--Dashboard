const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/test_bulk2');
    await mongoose.connection.dropDatabase(); // Clean start

    const schema = new mongoose.Schema({ email: { type: String, unique: true } });
    const TestModel = mongoose.model('Test', schema);

    await TestModel.init(); // Wait for index

    try {
        await TestModel.insertMany([{ email: 'a' }, { email: 'a' }], { ordered: false });
    } catch (error) {
        console.log("Caught Error Constructor:", error.constructor.name);
        console.log("error.writeErrors:", !!error.writeErrors);
        console.log("error.insertedDocs:", error.insertedDocs);
        console.log("error.insertedCount:", error.insertedCount);
    }
    await mongoose.disconnect();
}
test().catch(console.error);
