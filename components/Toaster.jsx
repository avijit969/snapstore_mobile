import { ToastAndroid } from "react-native";

const Toaster = ({ type = 'success', heading, message, position = 'top' }) => {
    const msg = heading ? `${heading}: ${message}` : message;
    ToastAndroid.show(msg, ToastAndroid.SHORT);
}

export default Toaster;
