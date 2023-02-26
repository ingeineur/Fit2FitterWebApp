import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Radio, Input, Grid, Icon, Segment, Image, Dropdown } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { IClientDto, LoginDto } from '../models/clients';

interface IProps {
    clientId: number;
}

interface IState {
    username: string;
    password: string;
    error: string;
    login: string;
    name: string;
    city: string;
    savingStatus: string;
    clientDtos: IClientDto[];
    clientUpdated: boolean;
    loginUpdated: boolean;
    loginDtos: LoginDto[];
    active: boolean
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

class AdminUserRegistrationModify extends React.Component<IProps, IState> {
    
    onSubmit = () => {
        this.setState({ username: '' });
    }

    public componentDidMount() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(this.props.clientId)
        
        ////get client info
        fetch('api/client?clientId=' + this.props.clientId)
            .then(response => response.json() as Promise<IClientDto[]>)
            .then(data => this.setState({
                clientDtos: data, clientUpdated: true
            })).catch(error => console.log(error));

        //get login info
        fetch('api/login/' + this.props.clientId)
            .then(response => response.json() as Promise<LoginDto[]>)
            .then(data => this.setState({
                loginDtos: data, loginUpdated: true
            })).catch(error => console.log(error));
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            clientDtos: [],
            username: '',
            password: 'p@ssword123',
            active: true,
            error: 'no status',
            login: '',
            name: '',
            city: '',
            savingStatus: '',
            clientUpdated: false,
            loginDtos: [],
            loginUpdated: false,
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

    updateActive = (event: any) => {
        this.setState({ active: event.target.value });
        console.log(event.target.value);
    }

    updateName = (event: any) => {
        this.setState({ name: event.target.value });
    }

    updateCity = (event: any) => {
        this.setState({ city: event.target.value });
    }

    onSave = () => {
        this.setState({ savingStatus: 'updating login in progress' })
        
        fetch('api/login', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: this.props.clientId,
                username: this.state.username,
                password: this.state.password,
                active: this.state.active,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Updating Access Success' })).catch(error => console.log('update login ---------->' + error));

        fetch('api/client', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.clientDtos[0].id,
                lastName: this.state.clientDtos[0].lastName,
                Grp: this.state.clientDtos[0].grp,
                firstName: this.state.name,
                address: this.state.clientDtos[0].address,
                city: this.state.city,
                age: this.state.clientDtos[0].age,
                created: this.state.clientDtos[0].created,
                avatar: this.state.clientDtos[0].avatar,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('create client ---------->' + error));   
    }

    setClientInfo = () => {
        this.setState({
            name: this.state.clientDtos[0].firstName,
            city: this.state.clientDtos[0].city
        });
    }

    setLoginInfo = () => {
        this.setState({
            username: this.state.loginDtos[0].username,
            password: this.state.loginDtos[0].password,
            active: this.state.loginDtos[0].active
        });
    }

    getPhoto = () => {
        if (this.state.clientDtos.length > 0 && this.state.clientDtos[0].avatar !== '') {
            return (<Segment size='tiny' attached='top' textAlign='center'><Image src={'/images/avatars/' + this.state.clientDtos[0].avatar} size='small' /></Segment>);
        }
        return;
    }

    setCountry = (event: any, data: any) => {
        this.setState({ city: data['value'] });
    }

    toggleActiveStatus = () => {
        this.setState({ active: !this.state.active });
    }

    render() {

        if (this.state.clientUpdated === true) {
            this.setClientInfo();
            this.setState({ clientUpdated: false });
        }

        if (this.state.loginUpdated === true && this.state.loginDtos.length > 0) {
            this.setLoginInfo();
            this.setState({ loginUpdated: false });
        }

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'/>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        {this.getPhoto()}
                    </Grid.Column>
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
                        <a>Active Status</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Radio toggle checked={this.state.active} onChange={this.toggleActiveStatus} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Name</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.name} placeholder='Name' onChange={this.updateName} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>City</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Dropdown id='country' value={this.state.city} selection options={city} onChange={this.setCountry} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button.Group floated='left' fluid>
                            <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Update</Button>
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
export default connect()(AdminUserRegistrationModify);
