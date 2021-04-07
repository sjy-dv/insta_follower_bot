import { IgApiClient, MediaRepositoryLikersResponseUsersItem } from 'instagram-private-api';
import { config } from 'dotenv';

export default class Bot {
    ig: IgApiClient ;
    user: string ;
    password: string ;
    accountToParse: string = 'theuniversalart';
    usersToFollow: MediaRepositoryLikersResponseUsersItem[];
    constructor(){
        config();
        this.user = process.env.INSTA_ID;
        this.password = process.env.INSTA_PW;
        this.ig = new IgApiClient();
    }

    async init() {
        const getWaitTime = () => (Math.random() * 5 * 60000) - (Math.random() * 1 * 60000);
        setInterval(async () => {
            if(!this.usersToFollow || this.usersToFollow.length < 1 ) {
                await this.getLatestPostLikers();
            } else {
                let user = this.usersToFollow.pop();
                while (user?.is_private) {
                    user = this.usersToFollow.pop();
                }
                await this.follow(user?.pk);
            } 
        }, getWaitTime())
    }

    async follow(userId: number) {
        await this.ig.friendship.create(userId);
    }

    async getLatestPostLikers() {
        const id = await this.ig.user.getIdByUsername(this.accountToParse);
        const feed = await this.ig.feed.user(id);
        const posts = await feed.items();
        this.usersToFollow = await (await this.ig.media.likers(posts[0].id)).users;
    }

    async login() {
        this.ig.state.generateDevice(this.user);
        await this.ig.simulate.preLoginFlow();
        const loggedInAccount = await this.ig.account.login(this.user, this.password);
        await this.ig.simulate.postLoginFlow();
        console.log('logged in..');
    }
}