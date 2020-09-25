import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Button, Segment, Grid, Menu, Label, Input, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MeasurementsPersonalTable from './PersonalTable'
import PersonalHeader from './PersonalHeader'

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    selectedDate: Date;
    macroGuides: IMacroGuides;
    personal: IPersonal;
    clients: IClient[];
    macrosPlans: IMacrosPlan[];
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    bodyFat: number;
}

interface IPersonal {
    name: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number,
    activityLevel: number;
    macroType: number;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
}

interface IClient {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

interface IMacrosPlan {
    id: number,
    height: number,
    weight: number,
    targetWeight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    updated: string;
    created: string;
    clientId: number;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Personal extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        this.setState({ selectedDate: new Date() });

        if (this.props.logins.length > 0) {
            console.log('--->' + this.props.logins[0].clientId);
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClient[]>)
                .then(data => this.setState({
                    clients: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlan[]>)
                .then(data => this.setState({
                    macrosPlans: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    onCancel = () => {
        this.setValuesFromDto();
    }

    getMacroType = (text: string) => {
        if (text === 'Lose Weight') {
            return 0;
        }

        if (text === 'Maintain/Muscle Gain') {
            return 1;
        }

        if (text === 'Gain Weight') {
            return 2;
        }

        return 0;
    }

    getMacroTypeText = (type: number) => {
        if (type === 0) {
            return 'Lose Weight';
        }

        if (type === 1) {
            return 'Maintain/Muscle Gain';
        }

        if (type === 2) {
            return 'Gain Weight';
        }

        return 'Lose Weight';
    }

    getActivityLevel = (text: string) => {
        if (text === 'Sedentary') {
            return 0;
        }

        if (text === 'Lightly Active') {
            return 1;
        }

        if (text === 'Moderately Active') {
            return 2;
        }

        if (text === 'Very Active') {
            return 3;
        }

        if (text === 'Extra Active') {
            return 4;
        }

        return 0;
    }

    getActivityLevelText = (type: number) => {
        if (type === 0) {
            return 'Sedentary';
        }

        if (type === 1) {
            return 'Lightly Active';
        }

        if (type === 2) {
            return 'Moderately Active';
        }

        if (type === 3) {
            return 'Very Active';
        }

        if (type === 4) {
            return 'Extra Active';
        }

        return 'Sedentary';
    }

    onSave = () => {
        if ((this.state.personal.carbPercent + this.state.personal.proteinPercent + this.state.personal.fatPercent) < 100.00) {
            this.setState({ savingStatus: 'Not Saved: Your Macro Portions is less than 100%' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })

        fetch('api/client', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.logins[0].clientId,
                lastName: '',
                firstName: this.state.personal.name,
                address: this.state.clients[0].address,
                city: this.state.clients[0].city,
                age: this.state.personal.age,
                created: this.state.clients[0].created,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));

       fetch('api/client/macrosplan', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                height: parseFloat(this.state.personal.height.toString()),
                weight: parseFloat(this.state.personal.weight.toString()),
                targetWeight: parseFloat(this.state.personal.targetWeight.toString()),
                macroType: this.getMacroTypeText(this.state.personal.macroType),
                activityLevel: this.getActivityLevelText(this.state.personal.activityLevel),
                carbPercent: this.state.personal.carbPercent,
                proteinPercent: this.state.personal.proteinPercent,
                fatPercent: this.state.personal.fatPercent,
                updated: new Date(),
                created: new Date(),
                clientId: this.props.logins[0].clientId,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
    }

    getComponent = () => {
        if (this.state.activeItem == 'Macro') {
            return (<MeasurementsPersonalTable type='Macro' personal={this.state.personal} updatePersonal={this.updatePersonal} update={this.state.updated} />);
        }
    }

    updatePersonal = (input: IPersonal) => {
        this.setState({
            personal: {
                name: input.name, age: input.age, height: input.height, weight: input.weight, targetWeight: input.targetWeight, activityLevel: input.activityLevel, macroType: input.macroType,
                carbPercent: input.carbPercent, proteinPercent: input.proteinPercent, fatPercent: input.fatPercent
            }
        });
        console.log(input.targetWeight);
        this.setState({ updated: !this.state.updated, savingStatus:'Not Saved' });
    }

    constructor(props: LoginProps) {
        super(props);
        this.updatePersonal = this.updatePersonal.bind(this);
        this.state = {
            username: '', password: '',
            activeItem: 'Macro',
            selectedDate: new Date(),
            macroGuides: { carb: 0, protein: 0, fat: 0, veg: 0, bodyFat: 0 },
            personal: { name: '', age: 0, height: 0.0, weight: 0.0, targetWeight:0.0, activityLevel: 0, macroType: 0, carbPercent: 25.0, proteinPercent: 35.0, fatPercent: 20.0 },
            clients: [],
            macrosPlans: [],
            updated: false,
            apiUpdate: false,
            savingStatus:'No Status'
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            const client = this.state.clients[0];
            this.state.personal.name = client.firstName + ' ' + client.lastName;
            this.state.personal.age = client.age;
            this.setState({ personal: this.state.personal });
            console.log(this.state.personal.name);
            this.setState({ apiUpdate: false, updated: !this.state.updated });
        }

        if (this.state.macrosPlans.length > 0) {
            const plan = this.state.macrosPlans[0];
            this.state.personal.height = plan.height;
            this.state.personal.weight = plan.weight;
            this.state.personal.targetWeight = plan.targetWeight;
            this.state.personal.carbPercent = plan.carbPercent;
            this.state.personal.proteinPercent = plan.proteinPercent;
            this.state.personal.fatPercent = plan.fatPercent;
            this.state.personal.activityLevel = this.getActivityLevel(plan.activityLevel);
            this.state.personal.macroType = this.getMacroType(plan.macroType);
            this.setState({ personal: this.state.personal });
            console.log(this.state.personal.name);
            this.setState({ apiUpdate: false, updated: !this.state.updated });
        }
    }

    getColour = () => {
        if (this.state.savingStatus === 'Saved' || this.state.savingStatus === 'No Status') {
            return 'green';
        }

        return 'red';
    }

    render() {
        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        const activeItem = this.state.activeItem;
        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.setValuesFromDto();
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Personal Tracker</Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment textAlign='center'>
                                <PersonalHeader guides={this.state.macroGuides} personal={this.state.personal} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Menu attached='top' tabular compact>
                                <Menu.Item
                                    name='Macro'
                                    active={activeItem === 'Macro'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>

                            <Segment textAlign='center' attached='bottom'>
                                {this.getComponent()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' width={16} textAlign='center' floated='left'>
                            <div style={divLabelStyle}>
                                <a>{this.state.savingStatus}</a>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        <Grid.Column width={4} textAlign='left' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onCancel} secondary>Reset</Button>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onSave} primary>Save</Button>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign='left' floated='left'>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }

    private getLoginCredentials = () => {
        this.props.requestLogins(this.state.username, this.state.password);
    }

    private clearCredentials = () => {
        this.props.requestLogout(this.state.username, this.state.password);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Personal as any);