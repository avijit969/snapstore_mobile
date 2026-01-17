import { StyleSheet } from "react-native";
import { wp } from "../helpers/common";
import { theme } from "./theme";

export const mediaStyles = StyleSheet.create({
    toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    contentContainer: {
        flex: 1,
    },
    BSDetailsContainer: {
        marginTop: wp(2),
    },
    BSContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    BSButton: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: wp(1)
    },
    BSButtonText: {
        fontSize: wp(1.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.dark,
    },
    line: {
        height: 1,
        backgroundColor: theme.colors.darkLight,
        marginVertical: wp(1),
        marginHorizontal: wp(1),
    },
    BSDateTime: {
        fontSize: wp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.dark,
        margin: wp(3),
    },
    BSDetailsItems: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
        margin: wp(3),
    },
    BSDetails1stItems: {
        fontSize: wp(2.1),
        fontWeight: theme.fonts.bold,
        color: theme.colors.dark,
        flexDirection: 'row',
        alignItems: 'center',
    },
    BSDetails2ndItems: {
        fontSize: wp(1.8),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.dark,
        flexDirection: 'row',
        alignItems: 'center',
    },
    BSDetailsTitle: {
        fontSize: wp(3),
        fontWeight: theme.fonts.bold,
        color: theme.colors.dark,
        marginLeft: wp(3),
    }
});
