class Apifeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);

        this.query = this.query.find(queryObj);

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            // Split sort fields by comma and handle each field
            const sortFields = this.queryStr.sort.split(',');
            const sortOptions = {};

            sortFields.forEach(field => {
                // Toggle the sort direction
                if (Apifeatures.sortDirection === undefined) {
                    Apifeatures.sortDirection = {};
                }

                if (Apifeatures.sortDirection[field] === undefined || Apifeatures.sortDirection[field] === 1) {
                    Apifeatures.sortDirection[field] = -1; // Set to descending
                } else {
                    Apifeatures.sortDirection[field] = 1; // Set to ascending
                }

                sortOptions[field] = Apifeatures.sortDirection[field];
            });

            // Convert sort options to string format for Mongoose
            const sortBy = Object.entries(sortOptions)
                .map(([field, direction]) => `${field} ${direction}`)
                .join(' ');

            this.query = this.query.sort(sortBy);
        } else {
            // Default sort
            this.query = this.query.sort('-updatedAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = Apifeatures;
