import React from 'react';
import { Text as PaperText } from 'react-native-paper';

const Text = (props: any) => {
    return <PaperText {...props}>{props.children}</PaperText>;
};

export default Text;
