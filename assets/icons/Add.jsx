import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Add = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={props.width} height={props.height} color={props.color} fill="none" {...props}>
        <Path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default Add;
