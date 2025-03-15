import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    orders: { type: Number, default: 0 } 
});

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },
    services: [{ type: String }],
    link: { type: String, required: true },
    subtopics: [subtopicSchema]
});


categorySchema.pre("save", function (next) {
    if (this.isNew) {
        this.subtopics = this.services.map(service => ({
            name: service,
            orders: 0 
        }));
    }
    next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;