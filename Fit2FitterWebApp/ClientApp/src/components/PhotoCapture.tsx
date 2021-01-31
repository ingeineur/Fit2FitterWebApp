import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, Grid, Segment, Menu, Dropdown, Label } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { RouteComponentProps } from 'react-router';
import { ReferenceObject } from 'popper.js';
import { isNullOrUndefined } from 'util';
import ImageUploader from 'react-images-upload';
import * as fs from 'fs';
import * as path from 'path';


interface IProps {
}

interface IState {
    username: string;
    password: string;
    imagePath: string;
    imgSrc: any,
    pictures: any[]
}

const blobToBase64 = (blob:any) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
};

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class PhotoCapture extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', imgSrc: '', pictures: [], imagePath:'http://ingeineur-001-site1.ctempurl.com/1dc2_imperial_logo_dd.jpg'
        };
    }

    saveImageCapture = () => {
        if (this.state.imgSrc != null) {
            console.log('todo: save image');
        }
        else {
            console.log('webcam ref is null');
        }
    }

    onDrop(picture:any) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    fileToDataUri = (file: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })

    handleImageChange = (event: any) => {
        console.log(URL.createObjectURL(event.target.files[0]));
        //this.fileToDataUri(event.target.files[0]).then(dataUri => { this.setState({ imgSrc: dataUri }) });

        console.log(event.target.files[0]);
        console.log(event.target.files[0]['name']);
        const formData = new FormData()
        formData.append('Filename', event.target.files[0]['name'])
        formData.append('FormFile', event.target.files[0])

        fetch('api/Utilities/image/meal/upload',
            {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    render() {
        //if (this.props.logins.length > 0) {
        if (true) {
            return (
                <div>
                    <input
                        type='file'
                        accept="image/*"
                        onChange={this.handleImageChange}
                    />
                    <img src={this.state.imgSrc} alt='avatar' />
                </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(PhotoCapture as any);