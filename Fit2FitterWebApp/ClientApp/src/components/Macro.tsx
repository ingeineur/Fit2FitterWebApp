import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Label, Input, Grid, Icon, Menu, Segment, GridColumn } from 'semantic-ui-react'
import { isNullOrUndefined, isNull } from 'util';

interface IProps {
    meal: IMeal,
    guides: IMacroGuides,
    updateParentCarb: Function
}

interface IMeal {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
    carbDesc: string;
    proteinDesc: string;
    fatDesc: string;
    fruitsDesc: string;
    type: number;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IState {
    activeItem: string;
    username: string;
    password: string;
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    type: number;
}

class Macro extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            activeItem: 'carb', username: '', password: '', carb: 0, protein: 0, fat: 0, veg:0, type: 1
        };
    }

    public componentDidMount() {
        this.setState({ carb: this.props.meal.carb, protein: this.props.meal.protein, fat: this.props.meal.fat, veg: 0, type: this.props.meal.type });
    }

    updateCarb = (event: any) => {
        if (isNaN(parseFloat(event.target.value))) {
            this.setState({ carb: 0 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
            return;
        }

        this.setState({ carb: parseFloat(event.target.value) });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    addCarb = (event: any) => {
        this.setState({ carb: this.state.carb + 1 });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    minusCarb = (event: any) => {
        if (this.state.carb > 0) {
            this.setState({ carb: this.state.carb - 1 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
        }
    }

    addProtein = (event: any) => {
        this.setState({ protein: this.state.protein + 1 });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    minusProtein = (event: any) => {
        if (this.state.protein > 0) {
            this.setState({ protein: this.state.protein - 1 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
        }
    }

    addFat = (event: any) => {
        this.setState({ fat: this.state.fat + 1 });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    minusFat = (event: any) => {
        if (this.state.fat > 0) {
            this.setState({ fat: this.state.fat - 1 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
        }
    }

    addVeg = (event: any) => {
        this.setState({ veg: this.state.veg + 1 });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    minusVeg = (event: any) => {
        if (this.state.veg > 0) {
            this.setState({ veg: this.state.veg - 1 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
        }
    }

    updateVeg = (event: any) => {
        if (isNaN(parseFloat(event.target.value))) {
            this.setState({ veg: 0 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
            return;
        }

        this.setState({ veg: parseInt(event.target.value) });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    updateProtein = (event: any) => {
        if (isNaN(parseFloat(event.target.value))) {
            this.setState({ protein: 0 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
            return;
        }

        this.setState({ protein: parseFloat(event.target.value) });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    updateFat = (event: any) => {
        if (isNaN(parseFloat(event.target.value))) {
            this.setState({ fat: 0 });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
            return;
        }

        this.setState({ fat: parseFloat(event.target.value) });
        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg)
    }

    updateMeal = (event: any) => {
        //this.setState({ fat: event.target.value });
        //console.log(event.target.value);
    }

    getColour = (total: number) => {
        if (total > 50.0 && total < 100) {
            return 'orange';
        }

        if (total === 100) {
            return 'teal';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'grey';
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

//    <Grid.Row columns={4} stretched>
//    <Grid.Column width={2} verticalAlign='middle' textAlign='center'>
//        <h5>C</h5>
//    </Grid.Column>
//    <Grid.Column width={8}>
//        <Input size='mini' placeholder='Descriptions' />
//    </Grid.Column>
//    <Grid.Column width={4}>
//        <Input size='mini' placeholder='Macro' value={this.state.carb} onChange={this.updateCarb} />
//    </Grid.Column>
//    <Grid.Column width={2} as='div' textAlign='center'>
//        <div>
//            <Button size='tiny' onClick={this.addCarb} inverted icon>
//                <Icon name='plus' color='black' />
//            </Button>
//            <Button size='tiny' onClick={this.minusCarb} inverted icon>
//                <Icon name='minus' color='black' />
//            </Button>
//        </div>
//    </Grid.Column>
//</Grid.Row>
//    <Grid.Row columns={4} stretched>
//        <Grid.Column width={2} textAlign='center' verticalAlign='middle'>
//            <h5>P</h5>
//        </Grid.Column>
//        <Grid.Column width={8}>
//            <Input size='mini' placeholder='Descriptions' />
//        </Grid.Column>
//        <Grid.Column width={4}>
//            <Input size='mini' placeholder='Macro' value={this.state.protein} onChange={this.updateProtein} />
//        </Grid.Column>
//        <Grid.Column width={2} as='div' textAlign='center'>
//            <div>
//                <Button size='tiny' onClick={this.addProtein} inverted icon>
//                    <Icon name='add' color='black' />
//                </Button>
//                <Button size='tiny' onClick={this.minusProtein} inverted icon>
//                    <Icon name='minus' color='black' />
//                </Button>
//            </div>
//        </Grid.Column>
//    </Grid.Row>
//    <Grid.Row columns={4} stretched>
//        <Grid.Column width={2} verticalAlign='middle' textAlign='center'>
//            <h5>F</h5>
//        </Grid.Column>
//        <Grid.Column width={8}>
//            <Input size='small' placeholder='Descriptions' />
//        </Grid.Column>
//        <Grid.Column width={4}>
//            <Input size='mini' placeholder='Macro' value={this.state.fat} onChange={this.updateFat} />
//        </Grid.Column>
//        <Grid.Column width={2} as='div' textAlign='center'>
//            <div>
//                <Button size='tiny' onClick={this.addFat} inverted icon>
//                    <Icon name='add' color='black' />
//                </Button>
//                <Button size='tiny' onClick={this.minusFat} inverted icon>
//                    <Icon name='minus' color='black' />
//                </Button>
//            </div>
//        </Grid.Column>
//    </Grid.Row>
//    <Grid.Row columns={4} stretched>
//        <Grid.Column width={2} as='div' verticalAlign='middle' textAlign='center'>
//            <div>
//                <h5>V</h5>
//            </div>
//        </Grid.Column>
//        <Grid.Column width={8}>
//            <Input size='small' placeholder='Descriptions' />
//        </Grid.Column>
//        <Grid.Column width={4}>
//            <Input size='mini' placeholder='Macro' value={this.state.veg} onChange={this.updateVeg} />
//        </Grid.Column>
//        <Grid.Column width={2} as='div' textAlign='center'>
//            <div>
//                <Button size='tiny' onClick={this.addVeg} inverted icon>
//                    <Icon name='add' color='black' />
//                </Button>
//                <Button size='tiny' onClick={this.minusVeg} inverted icon>
//                    <Icon name='minus' color='black' />
//                </Button>
//            </div>
//        </Grid.Column>
//    </Grid.Row>

    render() {
        const activeItem = this.state.activeItem;

        if (this.state.type !== this.props.meal.type)
        {
            this.setState({ carb: this.props.meal.carb, protein: this.props.meal.protein, fat: this.props.meal.fat, type: this.props.meal.type, veg: this.props.meal.fruits });
        }

        this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg);

        return (
            <Grid>
                <Grid.Column stretched width={4}>
                    <Menu color='pink' fluid vertical pointing >
                        <Menu.Item
                            name='Carb'
                            active={activeItem === 'Carb'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Protein'
                            active={activeItem === 'Protein'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Fat'
                            active={activeItem === 'Fat'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Veg'
                            active={activeItem === 'Veg'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                </Grid.Column>
            </Grid>);
    }
}

export default connect()(Macro);