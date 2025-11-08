import axiosClient from './axiosClient'

const CategoryAPI = {

    // Lấy tất cả categories
    getAll: () => {
        const url = '/api/category'
        return axiosClient.get(url)
    }

}

export default CategoryAPI
