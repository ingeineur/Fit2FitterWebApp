import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

interface IProps {
    username: string;
}

interface IState {
    username: string;
    activeItem: string;
    error: string;
    login: string;
}

class AdminResetPwd extends React.Component<IProps, IState> {
    
    onSubmit = () => {
        console.log("test");
        this.setState({ username: '' });
    }

    public componentDidMount() {
        this.setState({ username: this.props.username });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
        console.log(event.target.value);
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', activeItem: '', error: 'no status', login:''
        };
    }

    handleItemClick = () => {
        if (this.state.username === '') {
            this.setState({ error: 'Please Dont Leave Empty Fields' });
            return;
        }

        var fetchStr = 'api/login/reset?username=' + this.state.username;
        fetch(fetchStr, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.ok).then(data => {
            if (data) {
                this.setState({ error: 'Successfully reset password, please check your email (username)' })
            }
            else {
                this.setState({ error: 'Reset password is unsuccessfull, please check with fit2fitter admin' })
            }
        }).catch(error => console.log('reset password  ---------->' + error));
    }

    render() {
        return (
            <div>
                <Form size="small">
                    <Form.Field>
                        <label>Username</label>
                        <Input type="username" value={this.state.username} onChange={this.updateInput} placeholder='Username' />
                    </Form.Field>
                    <div>
                        <Button type='submit' color='red' onClick={this.handleItemClick}>Reset</Button>
                        <a>{this.state.error}</a>
                    </div>
                </Form>
            </div>
        );
    }
}

//export default connect()(Home);
export default connect()(AdminResetPwd);
