import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg";

const CameraLensIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={props.width} height={props.height} color={props.color} fill="none" {...props}>
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <Path d="M12 8H21M16 12V21M8 12V3M12 16H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export default CameraLensIcon;
