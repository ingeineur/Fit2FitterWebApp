import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    password1: string;
    activeItem: string;
    error: string;
    login: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters
    
class Admin extends React.Component<LoginProps, IState > {
    
    onSubmit = () => {
        console.log("test");
        this.setState({ username: '', password:'' });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
        console.log(event.target.value);
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
        console.log(event.target.value);
    }

    updateInput3 = (event: any) => {
        this.setState({ password1: event.target.value });
        console.log(event.target.value);
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', password1: '', activeItem: '', error: 'no status', login:''
        };
    }

    handleItemClick = () => {
        if (this.state.password1 === '' || this.state.password === '') {
            this.setState({ error: 'Please Dont Leave Empty Fields' });
            return;
        }

        if (this.state.password !== this.state.password1) {
            this.setState({ error: "Entered Passwords Don't Match" });
            return;
        }

        if (this.props.logins.length > 0) {
            var login = this.props.logins[0];
            console.log(JSON.stringify({
                id: login.clientId,
                username: login.username,
                password: this.state.password1,
                active: login.active,
                lastLogin: new Date(),
                clientId: this.props.logins[0].clientId,
            }));
            fetch('api/login', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: login.id,
                    username: login.username,
                    password: this.state.password1,
                    active: login.active,
                    lastLogin: new Date(),
                    clientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ login: 'updated' })).catch(error => console.log('put macros ---------->' + error));
        }
    }

    render() {
        var divLabelStyle2 = {
            color: 'pink',
            fontStyle: 'italic'
        };

        if (this.props.logins.length > 0 && this.state.login !== 'updated') {
            return (
                <div>
                    <div style={divLabelStyle2}>
                        <h1>Update Password</h1>
                    </div>

                    <Form size="small">
                        <Form.Field>
                            <label>Username </label>
                            <Input type="username" value={this.props.logins[0].username} placeholder='Username' />
                        </Form.Field>
                        <Form.Field>
                            <label>New Password </label>
                            <Input type="password" value={this.state.password} placeholder='Password' onChange={this.updateInput2} />
                        </Form.Field>
                        <Form.Field>
                            <label>Re-Type New Password </label>
                            <Input type="password" value={this.state.password1} placeholder='Password' onChange={this.updateInput3} />
                        </Form.Field>
                        <div>
                            <Button type='submit' primary onClick={this.handleItemClick}>Update</Button>
                            <a>{this.state.error}</a>
                        </div>
                    </Form>
                </div>
            );
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Admin as any);
