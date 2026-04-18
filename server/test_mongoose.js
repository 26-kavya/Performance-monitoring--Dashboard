const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/test_bulk');

    const schema = new mongoose.Schema({ email: { type: String, unique: true } });
    const TestModel = mongoose.models.Test || mongoose.model('Test', schema);

    await TestModel.init(); // Wait for index!
    await TestModel.deleteMany({});

    try {
        await TestModel.insertMany([{ email: 'a' }, { email: 'a' }], { ordered: false });
    } catch (error) {
        console.log("Caught error!");
        try {
            console.log('insertedDocs length:', error.insertedDocs.length);
        } catch (inner) {
            console.log("Inner error:", inner.message);
        }
    }
    await mongoose.disconnect();
}
test().catch(console.error);
