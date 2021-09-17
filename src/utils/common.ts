export const CommonUtil = {
    generateKey: (key: string | number = "", index: number) => {
        return `${key}_${index}`;
    },
};
