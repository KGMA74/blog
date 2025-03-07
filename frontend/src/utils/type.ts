import type { User } from "../redux/features/authApiSlice";


export interface Profile {
    user: User,
    bio: string | null,
    avatar: string | null,
    confirmed: boolean,
    updated_at: string,

}
export interface Tag{
    name: string,
    description: string
}

export interface Article {
    id: number,
    author: number,
    tags: Tag[],
    title: string,
    content: string,
    image: string | null;
    views: number
    created_at: string,
    updated_at: string,
};

export interface Vote {
    id: number,
    author: Profile
}

export interface postType {
    id: number,
    author: ProfileType,
    category: string,
    parent_post:number,
    tags: TagType[],
    title: string,
    details: string,
    created: string,
    updated: string,
};


export interface voteType {
    id: number,
    author: number,
    post: number,
    type: string,
    created: string, 
    updated: string,
}


export interface TagType {
    name: string;
    description: string ;
}

export interface ProfileType {
    user: User,
    photo: string | null,
    reputation: number,
    bio: string | null,
    confirmed: boolean,
    updated: string,
    skills?: Skills[]
}
export interface Skills {
    id: number; name: string
}

export interface categoryType {
    name: string;
    description: string;
}

export interface userType {
    id: number;
    nickname: string;
    email: string;
    last_login?: string;

}

export interface conversationtype {
    id: string;
    users: User[];
}

export interface instantMessageType {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: User;
    author: User;
}

export interface messageType {
    id: string;
    conversation: string;
    body: string;
    sent_to: User;
    author: User;
    created: string;
}