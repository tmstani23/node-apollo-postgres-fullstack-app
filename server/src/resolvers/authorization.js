import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

// if user me is authenticated skip, else display not authenticated error:
export const isAuthenticated = (parent,args,{me}) =>
    me ? skip : new ForbiddenError('Not authenticated as user.');

// Check user is admin resolver
export const isAdmin = combineResolvers(
    // first check if user is authenticated
    isAuthenticated,
    // Check if me user's role is ADMIN, if so continue else throw auth error
    (parent, args, {me: {role}}) => 
    role === 'ADMIN' 
    ? skip 
    : new ForbiddenError('Not authorized as ADMIN'),
)

export const isMessageOwner = async (
    parent,
    {id},
    {models, me},
) => {
    // find the message by id
    const message = await models.Message.findById(id, {raw: true});
    // if the message's owner doesn't match auth user id (me.id) throw an error
    if (message.userId !== me.id) {
        throw new ForbiddenError('Not authenticated as owner.');
    }
    //else continue
    return skip;
}