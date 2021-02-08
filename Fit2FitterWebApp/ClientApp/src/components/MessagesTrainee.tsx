import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Menu, Comment, Grid, Header, Label, Form, Icon, Image, List, Flag, Container, Message, Checkbox, Dropdown } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

interface IProps {
}

interface IState {
    updated: boolean;
    apiUpdate: boolean;
    dateChanged: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    typedMessage: string;
    filterUnread: boolean;
    toClientId: number;
    numChar: number;
    status: string;
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Messages extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
        
        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, name: client.firstName, age: client.age, city: client.city });
        });

        this.setState({ clients: this.state.clients });
    }

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            updated: false,
            apiUpdate: false,
            dateChanged: false,
            clientDtos: [],
            clients: [],
            typedMessage: '',
            filterUnread: false,
            toClientId: 2,
            numChar: 0,
            status:'Ready'
        };
    }

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.setValuesFromDto();
                this.setState({ apiUpdate: false });
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Messages</Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='left'>
                        <Grid.Column textAlign='left' floated='left'>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Messages as any);