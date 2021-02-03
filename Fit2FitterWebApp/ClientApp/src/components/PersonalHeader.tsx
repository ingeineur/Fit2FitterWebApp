import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Grid } from 'semantic-ui-react';

interface IProps {
    guides: IMacroGuides;
    personal: IPersonal;
    update: boolean;
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
    activityLevel: number;
    macroType: number;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class PersonalHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getActivityLevel = () => {
        if (this.props.personal.activityLevel == 0) {
            return 1.2;
        }

        if (this.props.personal.activityLevel == 1) {
            return 1.375;
        }

        if (this.props.personal.activityLevel == 2) {
            return 1.55;
        }

        if (this.props.personal.activityLevel == 3) {
            return 1.725;
        }

        if (this.props.personal.activityLevel == 4) {
            return 1.9;
        }

        return 0;
    }

    render() {

        var divLabelStyle1 = {
            color: 'black'
        };

        var divLabelStyle2 = {
            color: 'black'
        };

        var divLabelStyle3 = {
            color: 'black'
        };

        var divLabelStyle4 = {
            color: 'black',
            fontSize: '15px'
        };

        const bmr = (10 * this.props.personal.weight) + (6.25 * this.props.personal.height) - (5 * this.props.personal.age) - 161;
        const totalCalories = this.getActivityLevel() * bmr;
        const carb = ((this.props.personal.carbPercent / 100.0 * totalCalories)/4).toFixed(2);
        const protein = ((this.props.personal.proteinPercent / 100.0 * totalCalories)/4).toFixed(2);
        const fat = ((this.props.personal.fatPercent / 100.0 * totalCalories)/9).toFixed(2);
        const totalMacros = this.props.personal.carbPercent + this.props.personal.proteinPercent + this.props.personal.fatPercent;

        return (
            <Grid centered>
                <Grid.Row divided columns={3} textAlign='center'>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Carb(g)</a></div>
                        <div style={divLabelStyle1}><a>{carb}</a></div>
                    </Grid.Column>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Protein(g)</a></div>
                        <div style={divLabelStyle2}><a>{protein}</a></div>
                    </Grid.Column>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Fat(g)</a></div>
                        <div style={divLabelStyle3}><a>{fat}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(PersonalHeader);