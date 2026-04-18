const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/test_bulk2');

    const schema = new mongoose.Schema({ name: { type: String, required: true } });
    const TestModel = mongoose.model('Test2', schema);

    try {
        await TestModel.insertMany([{ name: 'a' }, {}], { ordered: false });
    } catch (error) {
        console.log("Constructor:", error.constructor.name);
        console.log("error.writeErrors:", !!error.writeErrors);
    }
    await mongoose.disconnect();
}
test().catch(console.error);
