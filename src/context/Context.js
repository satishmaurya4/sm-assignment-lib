import { useContext, useReducer } from "react";
import { createContext } from "react";

export const UserContext = createContext();

const storedUser = JSON.parse(localStorage.getItem('user'))


const initialState = {
    user: null,
    alert: null,
    isLoading: false,
    courseAdded: false,
}

const reducer = (state, action) => {
    // const { payload } = action;
    switch (action.type) {
        case "ADD_USER":
            return {
                ...state,
                user: action.loggedUser
            }
        case "OPEN_ALERT":
            const { status, message } = action.info;
            return {
                ...state,
                alert: {
                    status: status,
                    message: message
                }

            }
        
        case "CLOSE_ALERT":
            return {
                ...state,
                alert: null
            }
        case "START_LOADING":
            return {
                ...state,
                isLoading: true,
            }
        case "STOP_LOADING":
            return {
                ...state,
                isLoading: false,
            }
        case "ADD_COURSE":
            return {
                ...state,
                courseAdded: true,
            }
        
        default:
            return state;
    }
}

const UserProvider = ({ children }) => {
    const [globalState, dispatch] = useReducer(reducer, initialState);

    return <UserContext.Provider value={{globalState, storedUser,dispatch}}>
        {children}
    </UserContext.Provider>
}

export const useAppState = () => {
    return useContext(UserContext);
}

export default UserProvider;