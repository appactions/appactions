import { register } from 'cypress-app-actions';

register('Input', {
    role: 'Input',
    drivers: {
        fill: text => ($el, self) => {
            self.ref.value = text;
        },
        // isDisabled: () => ($el, self) => {
        //     return self.props.disabled;
        // },
    },
});
