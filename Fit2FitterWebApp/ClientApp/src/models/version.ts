export interface IVersion {
    major: number;
    minor: number;
    build: number;
}

export const CurrentVersion: IVersion = { major: 1, minor: 0, build: 6 };

export const UpdateVersionText: string = 'New Version Detected: Please Re-Open App and Refresh in a New Web Browser';

export const DivRequireUpdateLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fffafa',
    backgroundColor: 'red'
};
