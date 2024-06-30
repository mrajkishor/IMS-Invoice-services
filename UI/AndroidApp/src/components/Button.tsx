import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

const Button = (props: any) => {
    return <PaperButton {...props}>{props.children}</PaperButton>;
};

export default Button;
