import React from "react";

type AppContextType = {
    showAlert: (alertMessage: string) => void;
}

const AppContext = React.createContext<AppContextType>({
    showAlert: () => { }
});

export default AppContext;