export interface IVersion {
    major: number;
    minor: number;
    build: number;
}

export const CurrentVersion: IVersion = { major: 2, minor: 5, build: 0 };

export const UpdateVersionText: string = 'New Version Detected: Please Re-Open App and Refresh in a New Web Browser';

export const DivRequireUpdateLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fffafa',
    backgroundColor: 'red'
};
