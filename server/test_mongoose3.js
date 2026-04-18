const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/test_bulk2');

    const schema = new mongoose.Schema({ email: { type: String, unique: true } });
    const TestModel = mongoose.model('Test', schema);

    // Do not delete many, so 'a' still exists from last test

    try {
        await TestModel.insertMany([{ email: 'a' }, { email: 'a' }], { ordered: false });
    } catch (error) {
        console.log("error.insertedDocs:", error.insertedDocs);
    }
    await mongoose.disconnect();
}
test().catch(console.error);
