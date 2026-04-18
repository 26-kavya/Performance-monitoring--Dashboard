const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/completely_new_db_123');

    const schema = new mongoose.Schema({ email: { type: String, unique: true } });
    const TestModel = mongoose.model('Test3', schema);

    try {
        await TestModel.insertMany([{ email: 'a' }, { email: 'b' }], { ordered: false });
        console.log("Success!");
    } catch (error) {
        console.log("Constructor:", error.constructor.name);
        console.log("Message:", error.message);
    }
    await mongoose.disconnect();
}
test().catch(console.error);
