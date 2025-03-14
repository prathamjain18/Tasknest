package com.csci3130_g15.G15_backend;

import com.csci3130_g15.G15_backend.model.Workspace;
import com.csci3130_g15.G15_backend.repository.WorkspaceRepository;
import com.csci3130_g15.G15_backend.service.WorkspaceService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class WorkspaceServiceTest {
    @Mock
    private WorkspaceRepository workspaceRepository;

    @InjectMocks
    private WorkspaceService workspaceService;

    @Test
    public void testCreateWorkspace_SuccessfulCreation() {
        Workspace workspace = new Workspace();

        workspace.setWorkspaceName("New Workspace");
        workspace.setWorkspaceDes("sample workspace for testing");

        String result = this.workspaceService.createWorkspace(workspace);

        Assert.assertEquals("Workspace successfully created", result);
        verify(this.workspaceRepository).save(workspace);
    }

    @Test
    public void testCreateWorkspace_NullWorkspace() {
        Workspace workspace = null;

        Assert.assertThrows(IllegalArgumentException.class, () -> this.workspaceService.createWorkspace(workspace));
    }
}
