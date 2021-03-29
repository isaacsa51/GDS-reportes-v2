import React, { Component } from 'react'
import { View,Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionsCreators} from 'redux'
import { fetchUser } from '../redux/actions/index'

export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();

    }
     render() {
         const {currentUser } = this.props;
        
         console.log()
         if(currentUser==undefined){
             return(
                 <View></View>
             )
         }
        return (
            <View style={{flex: 1, justifyContent:'center'}}>
                <text>{currentUser.name} is logged in</text>
            </View>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps) (Main);