import Toast from "react-native-toast-message";

const Toaster = ({ type = 'success', heading, message, position = 'top' }) => {
    Toast.show({
        type: type,
        text1: heading,
        text2: message,
        position: position,
    });
}

export default Toaster;
