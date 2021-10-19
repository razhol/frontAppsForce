
const appReducer = (state = { users: [] }, action) => {
    switch (action.type) {

        case "REPLECE":
            return { ...state, users: action.payload }

        case "ADD":
            return { ...state, users: [...state.users, action.payload] }

        case "DELETE":
            let arr2 = state.users;
            let index2 = arr2.findIndex(x => x.id == action.payload)
            if (index2 >= 0) {
                arr2.splice(index2, 1)
            }

            return { ...state, users: arr2 }

        case "UPDATE":
            let arr = state.users;
            let index = arr.findIndex(x => x.id == action.payload.id)
            if (index >= 0) {
                arr[index].name = action.payload.name
                arr[index].email = action.payload.email
                arr[index].location = action.payload.location
            }

            return { ...state, users: arr }

        default:
            return state;
    }
}
export default appReducer;