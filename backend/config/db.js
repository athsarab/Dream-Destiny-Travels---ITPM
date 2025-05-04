const mongoose = require('mongoose');

const dburl = "mongodb+srv://athsarab:athsarab@cluster2.4qpsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2";

mongoose.set("strictQuery", true);

const connection = async () => {
    try {
        await mongoose.connect(dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connection;
