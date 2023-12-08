package com.projectcnw.salesmanagement.configs;

import com.projectcnw.salesmanagement.models.enums.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/**").permitAll()
                        .requestMatchers("/admin/auth/**").permitAll()
                        .requestMatchers("/admin/shop/**").hasAuthority(RoleType.ADMIN.name())
                        .requestMatchers("/admin/staffs/**").hasAuthority(RoleType.ADMIN.name())
                        .requestMatchers("/admin/upload/**").hasAuthority(RoleType.ADMIN.name())

                        .requestMatchers(HttpMethod.GET, "/admin/shop/*").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/shop/*").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/customer/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/customer/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/customer/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/customer/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.CARE.name(), RoleType.SALE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/base-products/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/base-products/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/base-products/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/base-products/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())

                        .requestMatchers(HttpMethod.POST,"/admin/balances/**").hasAnyAuthority(RoleType.ADMIN.name(),RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.GET,"/admin/balances/**").hasAnyAuthority(RoleType.ADMIN.name(),RoleType.WAREHOUSE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/import-item/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/import-item/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/import-item/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/import-item/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/import/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/import/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/import/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/import/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/vendor/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/vendor/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/vendor/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/vendor/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.WAREHOUSE.name())

                        .requestMatchers("/admin/orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name(), RoleType.CARE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name())

                        .requestMatchers(HttpMethod.GET, "/admin/return_orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.POST, "/admin/return_orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/return_orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/return_orders/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name())

                        .requestMatchers(HttpMethod.POST, "/admin/payment/**").hasAnyAuthority(RoleType.ADMIN.name(), RoleType.SALE.name(), RoleType.WAREHOUSE.name())
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
