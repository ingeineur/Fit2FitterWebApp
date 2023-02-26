import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Dropdown } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    clientId: number;
    error: string;
    login: string;
    name: string;
    city: string;
    updated: boolean;
    savingStatus: string;
}

const city = [
    {
        key: 'Malaysia',
        text: 'Malaysia',
        value: 'my'
    },
    {
        key: 'Australia',
        text: 'Australia',
        value: 'au'
    },
    {
        key: 'Singapore',
        text: 'Singapore',
        value: 'sg'
    },
    {
        key: 'Brunei',
        text: 'Brunei',
        value: 'bn'
    },
    {
        key: 'US',
        text: 'US',
        value: 'us'
    }
];

class AdminUserRegistration extends React.Component<IProps, IState> {
    
    onSubmit = () => {
        this.setState({ username: '' });
    }

    public componentDidMount() {
        //this.setState({ username: this.props.username });
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: 'p@ssword123', clientId: -1, activeItem: '', error: 'no status', login: '', name: '', city: '', updated: false, savingStatus: ''
        };
    }

    updateUsername = (event: any) => {
        this.setState({ username: event.target.value });
        console.log(event.target.value);
    }

    updatePassword = (event: any) => {
        this.setState({ password: event.target.value });
        console.log(event.target.value);
    }

    updateName = (event: any) => {
        this.setState({ name: event.target.value, updated: true });
    }

    updateCity = (event: any) => {
        this.setState({ city: event.target.value, updated: true });
    }

    onSave = () => {
        if (this.state.name.length < 1 || this.state.username.length < 1 || this.state.password.length < 1) {
            this.setState({ savingStatus: 'Field cannot be left empty' })
            return;
        }

        this.setState({ savingStatus: 'Creating client in progress' })

        fetch('api/client', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lastName: '',
                Grp: '1',
                firstName: this.state.name,
                address: '',
                city: this.state.city,
                age: 0,
                created: (new Date()).toISOString(),
                avatar: '',
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved', clientId: data })).catch(error => console.log('create client ---------->' + error));   
    }

    createAccess = (clientId: number, username: string, password: string) => {
        this.setState({ savingStatus: 'Creating access in progress' })

        fetch('api/login', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: clientId,
                username: username,
                password: password,
                active: true,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Creating Access Success' })).catch(error => console.log('create login ---------->' + error));
    }

    onReset = () => {
        this.setState({ name: '', city: '', updated: true });
    }

    setCountry = (event: any, data: any) => {
        this.setState({ city: data['value'] });
    }

    render() {
        if (this.state.clientId !== -1) {
            this.createAccess(this.state.clientId, this.state.username, this.state.password);
            this.setState({ clientId: -1, username: '', password: '', name: '', city: '' });
        }

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Username</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.username} placeholder='Username' onChange={this.updateUsername} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Password</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.password} placeholder='Username' onChange={this.updatePassword} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Name</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.name} placeholder='Name' onChange={this.updateName} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Country</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Dropdown id='country' value={this.state.city} selection options={city} onChange={this.setCountry} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button.Group floated='left' fluid>
                            <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onReset} ><Icon size='large' name='cancel' color='red' />Reset</Button>
                            <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Add</Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <div>{this.state.savingStatus}</div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

//export default connect()(Home);
export default connect()(AdminUserRegistration);
