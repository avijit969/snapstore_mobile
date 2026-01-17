import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const hp = (percentage: number): number => {
    return (percentage * deviceHeight) / 100;
}
export const wp = (percentage: number): number => {
    return (percentage * deviceWidth) / 100;
}

export const getHeight = (height: number, width: number): number => {
    if (height > width) {
        return 350;
    }
    else if (height < width) {
        return 230;
    }
    else {
        return 200;
    }
}
