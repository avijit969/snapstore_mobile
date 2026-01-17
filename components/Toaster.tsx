import { ToastAndroid } from "react-native";

interface ToasterProps {
    type?: 'success' | 'error' | 'info';
    heading?: string;
    message: string;
    position?: 'top' | 'bottom';
}

const Toaster = ({ type = 'success', heading, message, position = 'top' }: ToasterProps) => {
    const msg = heading ? `${heading}: ${message}` : message;
    ToastAndroid.show(msg, ToastAndroid.SHORT);
}

export default Toaster;
