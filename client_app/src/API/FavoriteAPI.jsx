import axiosClient from './axiosClient';

const FavoriteAPI = {
    // FR-021: Add product to wishlist
    addToFavorite: (id_user, id_product) => {
        const url = '/api/favorite/add';
        return axiosClient.post(url, { id_user, id_product });
    },

    // FR-022: Remove from wishlist by favorite ID
    removeFromFavorite: (id, id_user) => {
        const url = `/api/favorite/${id}`;
        return axiosClient.delete(url, { data: { id_user } });
    },

    // FR-022: Remove from wishlist by product ID
    removeByProduct: (id_user, id_product) => {
        const url = '/api/favorite/remove';
        return axiosClient.post(url, { id_user, id_product });
    },

    // FR-023: Get all favorites by user ID
    getFavoritesByUser: (id_user) => {
        const url = `/api/favorite/user/${id_user}`;
        return axiosClient.get(url);
    },

    // Check if product is in wishlist
    checkFavorite: (id_user, id_product) => {
        const url = `/api/favorite/check?id_user=${id_user}&id_product=${id_product}`;
        return axiosClient.get(url);
    },

    // Get count of favorites for user
    countFavorites: (id_user) => {
        const url = `/api/favorite/count/${id_user}`;
        return axiosClient.get(url);
    }
};

export default FavoriteAPI;
