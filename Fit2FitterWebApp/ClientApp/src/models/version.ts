export interface IVersion {
    major: number;
    minor: number;
    build: number;
}

export const CurrentVersion: IVersion = { major: 1, minor: 0, build: 2 };

export const UpdateVersionText: string = 'App Requires Update: Please Reload The Web Page';

export const DivRequireUpdateLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fffafa',
    backgroundColor: 'red'
};
