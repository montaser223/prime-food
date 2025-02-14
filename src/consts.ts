export const selectedDataFilter = '-vendors.menu -vendors._id -location.type -__v';

export const menuCategoryPath = 'vendors.menu.MenuCategory';

export const offer = 'offer name';

export const errorCodes = {
    unauthorized: {
        status: 403,
        message:"unauthorized to access this resource"
    },
    notFound: {
        status: 404,
        message: "data not found"
    },
    unsupportedMedia: {
        status: 413,
        message:""
    }
}