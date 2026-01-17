import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

export const hp = percentage => {
    return (percentage * deviceHeight) / 100
}
export const wp = percentage => {
    return (percentage * deviceWidth) / 100
}

export const getHeight = (height, width) => {
    if (height > width) {
        return 350
    }
    else if (height < width) {
        return 230
    }
    else {
        return 200
    }

}