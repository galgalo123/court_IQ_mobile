package com.courtiq.backend.team;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByUserId(Long userId);

    List<TeamMember> findByTeamId(Long teamId);

    boolean existsByUserIdAndTeamId(Long userId, Long teamId);

    boolean existsByUserIdAndTeamIdAndManagerTrue(Long userId, Long teamId);
}