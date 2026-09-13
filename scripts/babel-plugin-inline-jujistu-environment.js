module.exports = function inlineJujistuEnvironment({ types }, options) {
  const environment = options.environment;

  if (!environment) {
    throw new Error('The JUJISTU Babel environment option is required.');
  }

  return {
    name: 'inline-jujistu-environment',
    visitor: {
      MemberExpression(memberPath) {
        const { node } = memberPath;

        if (
          node.computed ||
          !types.isIdentifier(node.property, { name: 'JUJISTU_ENV' }) ||
          !types.isMemberExpression(node.object) ||
          node.object.computed ||
          !types.isIdentifier(node.object.property, { name: 'env' }) ||
          !types.isIdentifier(node.object.object, { name: 'process' })
        ) {
          return;
        }

        memberPath.replaceWith(types.stringLiteral(environment));
      },
    },
  };
};
