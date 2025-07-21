<?php

namespace App\Security;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        /** @var User $user */
        $user = $token->getUser();
        $roles = $user->getRoles();

        $jwt = $this->jwtManager->create($user); // Génére le token JWT

        $responseData = [
            'role' => $roles[0],
            'token' => $jwt,
        ];

        if (in_array('ROLE_ADMIN', $roles)) {
            $responseData['id'] = $user->getAdmin()?->getId();
        } elseif (in_array('ROLE_MEDECIN', $roles)) {
            $responseData['id'] = $user->getMedecin()?->getId();
        } else {
            $responseData['id'] = $user->getId();
        }

        return new JsonResponse($responseData);
    }
}