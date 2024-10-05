const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
    task: String,
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Seed Tasks
const seedTasks = async () => {
    const tasks = [
        { task: 'Buy groceries' },
        { task: 'Clean the house' },
        { task: 'Finish homework' },
        { task: 'Call Mom' },
        { task: 'Read a book' },
        // Add more tasks as needed
    ];

    await Task.deleteMany({}); // Clear existing tasks
    await Task.insertMany(tasks); // Insert new tasks
    console.log('Successfully seeded tasks');
    mongoose.connection.close();
};

seedTasks();