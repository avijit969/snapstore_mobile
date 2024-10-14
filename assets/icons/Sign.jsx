import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Sign = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={props.color} fill="none" {...props}>
    <Path d="M4 21V14.3936C4 11.7663 4 10.4526 4.35874 9.30431C4.86959 7.66915 6.67366 5.92189 8.07257 4.90417C8.96802 4.25272 9.81367 3.99439 11.8656 3.29139C12.193 3.17921 12.3568 3.12312 12.653 3.06783C12.9492 3.01253 13.0208 3.00972 13.164 3.00409C13.5303 2.98969 13.981 3.00996 14.4588 3.11939C14.802 3.19799 15.1425 3.32672 15.8236 3.58417L17.7348 4.36953C18.4651 4.66967 18.8346 5.48739 18.5771 6.23385C18.3041 7.02521 17.433 7.43653 16.6485 7.14453M10.1089 8C10.1089 8 12.7243 6.70713 13.7702 6.57906C14.3505 6.508 15.0351 6.64817 15.7358 6.8626L16.6485 7.14453M12 21C12.3237 19.6659 13.7962 18.9617 14.1179 18.8222C14.1208 18.821 14.1222 18.8204 14.1602 18.8051C14.1983 18.7899 14.2136 18.7842 14.2444 18.7728C15.0617 18.4705 16.2171 17.9148 16.7268 17.5L19.5607 15.6506C20.1896 15.1388 19.8804 14.3849 19.3133 14.0088C17.4785 12.7921 15.719 13.853 14.0259 14.6951C12.5527 15.4278 10.6179 14.3622 10.6179 12.7238C10.6179 10.4887 14.1046 9.45724 15.8849 10.1656L18.0793 10.8095C18.8889 11.0471 19.7378 10.5779 19.9513 9.77491C20.1441 9.04982 19.7492 8.29863 19.0358 8.03307L16.6485 7.14453" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default Sign;
